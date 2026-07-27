# QA — Fase 8.12

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Validação editorial

- Eclesiastes 3:1 registrado como referência de abertura;
- catálogo `continuous-version-catalog` na versão 1.0.0;
- política `explicit-compatibility-no-silent-migration-v1`;
- SemVer estrito declarado;
- versões futuras recusadas;
- versões antigas desconhecidas recusadas;
- migração silenciosa negada;
- doze restrições editoriais presentes.

## Domínio

- `0.0.0` aceito como SemVer válido;
- major, minor e patch comparados corretamente;
- versão incompleta recusada;
- prefixo `v` recusado;
- zeros à esquerda recusados;
- prerelease recusado;
- inteiro fora do intervalo seguro recusado;
- versão atual aceita;
- legado aceito somente quando listado;
- futuro recusado sem downgrade;
- antigo desconhecido recusado sem migração;
- matriz interna inválida recusada;
- `catalogVersion` lido somente de objeto.

## Integração — partilha

- `1.0.0` selado aceito;
- `1.0.0` sem selo aceito pela compatibilidade anterior;
- `1.0.1` selado corretamente recusado como futuro;
- `0.9.0` recusado sem migração;
- `latest` recusado como malformado;
- versão alterada depois do selo recusada por inconsistência;
- cópia sanitizada usa versão atual;
- nova impressão é calculada depois da sanitização.

## Integração — resposta

- `1.0.0` selado aceito;
- `2.0.0` recusado sem prévia;
- `0.8.0` recusado sem migração;
- versão `1` recusada como malformada;
- prévia sanitizada usa versão atual;
- nenhum histórico de incompatibilidade é criado.

## Interface

- versão aceita aparece nos avisos da prévia;
- versão futura informa recebida e atual;
- versão antiga informa ausência de migração explícita;
- versão malformada informa SemVer estrito;
- incompatibilidade impede consentimentos e persistência;
- arquivos compatíveis continuam seguindo os fluxos existentes.

## Persistência

A Fase 8.12 não cria:

- store Zustand;
- chave IndexedDB;
- log de incompatibilidades;
- contador de versões;
- cache de migração;
- atualização do arquivo externo.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
